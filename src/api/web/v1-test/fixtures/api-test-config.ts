export const config: Homenet.IConfig = {
  instances: [
    {
      id: 'one',
      class: 'light',
      type: 'test',
      options: {id: 1}
    },
    {
      id: 'two',
      class: 'light',
      type: 'test',
      options: {id: 2}
    },
    {
      id: 'three',
      class: 'light',
      type: 'test',
      options: {id: 3}
    },
    {
      id: 'generic',
      class: 'sensor',
      type: 'test',
      options: {
        isValue: true,
        isToggle: true
      }
    },
    {
      id: 'temperature',
      class: 'sensor',
      type: 'test-value',
      options: {
        isValue: true
      }
    },
    {
      id: 'humidity',
      class: 'sensor',
      type: 'test-value',
      options: {
        isValue: true
      }
    },
    {
      id: 'motion',
      class: 'sensor',
      type: 'test-trigger',
      options: {
        isTrigger: true
      }
    }
  ],
  scenes: [
    {
      id: 'day',
      name: 'Day'
    },
    {
      id: 'night',
      name: 'Night'
    }
  ],
  zones: [
    {
      id: 'simple',
      name: 'Simple',
      faIcon: null,
      parent: null,
      timeout: 0
    },
    {
      id: 'parent',
      name: 'Parent',
      faIcon: null,
      parent: null,
      timeout: 0
    },
    {
      id: 'child',
      name: 'Child',
      faIcon: null,
      parent: 'parent',
      timeout: 0
    },
    {
      id: 'simple-timeout',
      name: 'Simple Timeout',
      faIcon: null,
      parent: null,
      timeout: 60000
    },
    {
      id: 'parent-timeout',
      name: 'Parent Timeout',
      faIcon: null,
      parent: null,
      timeout: 0
    },
    {
      id: 'child-timeout',
      name: 'Child Timeout',
      faIcon: null,
      parent: 'parent-timeout',
      timeout: 60000
    }
  ]
};