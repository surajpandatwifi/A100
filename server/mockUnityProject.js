export const mockUnityProject = {
  name: "DemoRPG",
  path: "/Users/dev/UnityProjects/DemoRPG",
  scenes: [
    {
      name: "MainMenu",
      path: "Assets/Scenes/MainMenu.unity",
      gameObjects: [
        {
          name: "Canvas",
          components: ["RectTransform", "Canvas", "CanvasScaler", "GraphicRaycaster"],
          children: [
            { name: "TitleText", components: ["RectTransform", "TextMeshProUGUI"] },
            { name: "PlayButton", components: ["RectTransform", "Button", "Image"] },
            { name: "SettingsButton", components: ["RectTransform", "Button", "Image"] }
          ]
        },
        {
          name: "EventSystem",
          components: ["EventSystem", "StandaloneInputModule"]
        }
      ]
    },
    {
      name: "GameLevel01",
      path: "Assets/Scenes/GameLevel01.unity",
      gameObjects: [
        {
          name: "Player",
          components: ["Transform", "CharacterController", "PlayerController", "Animator", "Health"],
          children: [
            { name: "Camera", components: ["Transform", "Camera", "AudioListener"] },
            { name: "Weapon", components: ["Transform", "WeaponController"] }
          ]
        },
        {
          name: "Enemies",
          components: ["Transform"],
          children: [
            { name: "Goblin_01", components: ["Transform", "EnemyAI", "NavMeshAgent", "Health", "Animator"] },
            { name: "Goblin_02", components: ["Transform", "EnemyAI", "NavMeshAgent", "Health", "Animator"] },
            { name: "Orc_01", components: ["Transform", "EnemyAI", "NavMeshAgent", "Health", "Animator"] }
          ]
        },
        {
          name: "Environment",
          components: ["Transform"],
          children: [
            { name: "Terrain", components: ["Transform", "Terrain", "TerrainCollider"] },
            { name: "Trees", components: ["Transform"] },
            { name: "Buildings", components: ["Transform"] }
          ]
        }
      ]
    }
  ],
  scripts: [
    {
      name: "PlayerController.cs",
      path: "Assets/Scripts/Player/PlayerController.cs",
      content: `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 7f;

    private CharacterController controller;
    private Vector3 velocity;

    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    void Update()
    {
        Move();
        Jump();
    }

    private void Move()
    {
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");

        Vector3 move = transform.right * x + transform.forward * z;
        controller.Move(move * moveSpeed * Time.deltaTime);
    }

    private void Jump()
    {
        if (Input.GetButtonDown("Jump") && controller.isGrounded)
        {
            velocity.y = jumpForce;
        }

        velocity.y += Physics.gravity.y * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}`
    },
    {
      name: "Health.cs",
      path: "Assets/Scripts/Common/Health.cs",
      content: `using UnityEngine;
using UnityEngine.Events;

public class Health : MonoBehaviour
{
    [SerializeField] private float maxHealth = 100f;
    private float currentHealth;

    public UnityEvent onDeath;
    public UnityEvent<float> onHealthChanged;

    void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(float damage)
    {
        currentHealth -= damage;
        currentHealth = Mathf.Max(currentHealth, 0);

        onHealthChanged?.Invoke(currentHealth / maxHealth);

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    public void Heal(float amount)
    {
        currentHealth += amount;
        currentHealth = Mathf.Min(currentHealth, maxHealth);
        onHealthChanged?.Invoke(currentHealth / maxHealth);
    }

    private void Die()
    {
        onDeath?.Invoke();
        Destroy(gameObject);
    }
}`
    },
    {
      name: "EnemyAI.cs",
      path: "Assets/Scripts/Enemy/EnemyAI.cs",
      content: `using UnityEngine;
using UnityEngine.AI;

public class EnemyAI : MonoBehaviour
{
    [SerializeField] private float detectionRange = 10f;
    [SerializeField] private float attackRange = 2f;
    [SerializeField] private float attackDamage = 10f;

    private NavMeshAgent agent;
    private Transform player;
    private Health health;

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        health = GetComponent<Health>();
        player = GameObject.FindGameObjectWithTag("Player")?.transform;
    }

    void Update()
    {
        if (player == null) return;

        float distance = Vector3.Distance(transform.position, player.position);

        if (distance <= detectionRange)
        {
            agent.SetDestination(player.position);

            if (distance <= attackRange)
            {
                AttackPlayer();
            }
        }
    }

    private void AttackPlayer()
    {
        Health playerHealth = player.GetComponent<Health>();
        if (playerHealth != null)
        {
            playerHealth.TakeDamage(attackDamage * Time.deltaTime);
        }
    }
}`
    }
  ],
  prefabs: [
    {
      name: "Goblin",
      path: "Assets/Prefabs/Enemies/Goblin.prefab",
      components: ["Transform", "EnemyAI", "NavMeshAgent", "Health", "Animator"],
      usedInScenes: ["GameLevel01", "GameLevel02"]
    },
    {
      name: "HealthBar",
      path: "Assets/Prefabs/UI/HealthBar.prefab",
      components: ["RectTransform", "Image", "HealthBarUI"],
      usedInScenes: []
    }
  ],
  packages: [
    { name: "com.unity.textmeshpro", version: "3.0.6" },
    { name: "com.unity.ai.navigation", version: "1.1.5" },
    { name: "com.unity.inputsystem", version: "1.7.0" }
  ]
};
