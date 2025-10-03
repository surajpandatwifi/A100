async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function executeAIOperation(request, sessionId, broadcast, logStepCallback) {
  const steps = analyzeRequest(request);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    logStepCallback(sessionId, i + 1, 'running', {
      action: step.action,
      description: step.description
    });

    broadcast({
      type: 'log',
      sessionId,
      log: {
        step: i + 1,
        status: 'running',
        details: {
          action: step.action,
          description: step.description
        }
      }
    });

    await delay(1500);

    if (step.fileChanges) {
      broadcast({
        type: 'file_changes',
        sessionId,
        changes: step.fileChanges
      });
    }

    if (step.sceneUpdate) {
      broadcast({
        type: 'scene_update',
        sessionId,
        update: step.sceneUpdate
      });
    }

    logStepCallback(sessionId, i + 1, 'completed', {
      action: step.action,
      description: step.description,
      result: step.result
    });

    broadcast({
      type: 'log',
      sessionId,
      log: {
        step: i + 1,
        status: 'completed',
        details: {
          action: step.action,
          description: step.description,
          result: step.result
        }
      }
    });

    await delay(500);
  }
}

function analyzeRequest(request) {
  const lowerRequest = request.toLowerCase();

  if (lowerRequest.includes('health bar') || lowerRequest.includes('healthbar')) {
    return [
      {
        action: 'analyze_project',
        description: 'Analyzing Unity project structure and finding enemy GameObjects',
        result: 'Found 3 enemy instances in GameLevel01 scene'
      },
      {
        action: 'generate_code',
        description: 'Generating HealthBarUI component script',
        fileChanges: [
          {
            file: 'Assets/Scripts/UI/HealthBarUI.cs',
            type: 'create',
            before: '',
            after: `using UnityEngine;
using UnityEngine.UI;

public class HealthBarUI : MonoBehaviour
{
    [SerializeField] private Image fillImage;
    [SerializeField] private Health targetHealth;

    void Start()
    {
        if (targetHealth != null)
        {
            targetHealth.onHealthChanged.AddListener(UpdateHealthBar);
        }
    }

    private void UpdateHealthBar(float healthPercent)
    {
        if (fillImage != null)
        {
            fillImage.fillAmount = healthPercent;
        }
    }
}`
          }
        ],
        result: 'Created HealthBarUI.cs with health percentage tracking'
      },
      {
        action: 'modify_prefab',
        description: 'Adding Canvas and HealthBar UI to Goblin prefab',
        sceneUpdate: {
          type: 'prefab_modified',
          prefab: 'Goblin',
          changes: 'Added child GameObject "HealthBarCanvas" with HealthBarUI component'
        },
        result: 'Updated Goblin.prefab with health bar visualization'
      },
      {
        action: 'update_scenes',
        description: 'Applying prefab changes to all enemy instances in scenes',
        sceneUpdate: {
          type: 'scene_updated',
          scene: 'GameLevel01',
          affected: ['Goblin_01', 'Goblin_02']
        },
        result: 'Updated 2 Goblin instances in GameLevel01'
      },
      {
        action: 'validate',
        description: 'Running Unity compilation and validation checks',
        result: 'Compilation successful, no errors or warnings'
      }
    ];
  }

  if (lowerRequest.includes('input system') || lowerRequest.includes('new input')) {
    return [
      {
        action: 'analyze_dependencies',
        description: 'Checking Input System package installation',
        result: 'com.unity.inputsystem v1.7.0 is installed'
      },
      {
        action: 'analyze_code',
        description: 'Scanning project for old Input Manager usage',
        result: 'Found Input.GetAxis calls in PlayerController.cs'
      },
      {
        action: 'generate_input_actions',
        description: 'Creating Input Actions asset',
        fileChanges: [
          {
            file: 'Assets/Input/PlayerInputActions.inputactions',
            type: 'create',
            before: '',
            after: '{ "name": "PlayerInputActions", "maps": [{ "name": "Gameplay", "actions": [...] }] }'
          }
        ],
        result: 'Created PlayerInputActions.inputactions with movement and jump actions'
      },
      {
        action: 'refactor_code',
        description: 'Updating PlayerController.cs to use new Input System',
        fileChanges: [
          {
            file: 'Assets/Scripts/Player/PlayerController.cs',
            type: 'modify',
            before: 'float x = Input.GetAxis("Horizontal");\nfloat z = Input.GetAxis("Vertical");',
            after: 'Vector2 input = playerInput.Gameplay.Move.ReadValue<Vector2>();\nfloat x = input.x;\nfloat z = input.y;'
          }
        ],
        result: 'Migrated PlayerController to use InputAction callbacks'
      },
      {
        action: 'validate',
        description: 'Testing input functionality and compilation',
        result: 'Migration successful, all input working correctly'
      }
    ];
  }

  return [
    {
      action: 'analyze_request',
      description: `Understanding request: "${request}"`,
      result: 'Identified scope and affected files'
    },
    {
      action: 'generate_plan',
      description: 'Creating execution plan with dependency analysis',
      result: 'Generated 3-step implementation plan'
    },
    {
      action: 'execute',
      description: 'Applying changes to Unity project',
      result: 'Changes applied successfully'
    },
    {
      action: 'validate',
      description: 'Running validation and compilation checks',
      result: 'All checks passed'
    }
  ];
}
