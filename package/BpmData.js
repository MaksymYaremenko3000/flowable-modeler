/**
 * Stores parameters related to the process designer
 */
export default class BpmData {
  constructor() {
    this.controls = [] // Designer controls
    this.init()
  }

  init() {
    this.controls = [
      {
        action: 'create.start-event',
        title: 'Start Event'
      },
      {
        action: 'create.intermediate-event',
        title: 'Intermediate Event'
      },
      {
        action: 'create.end-event',
        title: 'End Event'
      },
      {
        action: 'create.exclusive-gateway',
        title: 'Gateway'
      },
      {
        action: 'create.task',
        title: 'Task'
      },
      {
        action: 'create.user-task',
        title: 'User Task'
      },
      {
        action: 'create.user-sign-task',
        title: 'Multi-User Task'
      },
      {
        action: 'create.subprocess-expanded',
        title: 'Sub Process'
      },
      {
        action: 'create.data-object',
        title: 'Data Object'
      },
      {
        action: 'create.data-store',
        title: 'Data Store'
      },
      {
        action: 'create.participant-expanded',
        title: 'Expanded Process'
      },
      {
        action: 'create.group',
        title: 'Group'
      }
    ]
  }

  // Get control config by action
  getControl(action) {
    const result = this.controls.filter(item => item.action === action)
    return result[0] || {}
  }
}
