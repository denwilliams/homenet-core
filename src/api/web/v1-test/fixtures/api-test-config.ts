export const config: Homenet.IConfig = {
  instances: [
    {
      id: 'one',
      class: 'light',
      type: 'test',
      options: {id: 1, zone: 'simple'}
    },
    {
      id: 'two',
      class: 'light',
      type: 'test',
      options: {id: 2, zone: 'simple'}
    },
    {
      id: 'three',
      class: 'light',
      type: 'test',
      options: {id: 3, zone: 'child'}
    },
    {
      id: 'generic',
      class: 'sensor',
      type: 'test',
      options: {
        isValue: true,
        isToggle: true,
        zone: 'simple'
      }
    },
    {
      id: 'temperature',
      class: 'sensor',
      type: 'test-value',
      options: {
        isValue: true,
        zone: 'simple'
      }
    },
    {
      id: 'humidity',
      class: 'sensor',
      type: 'test-value',
      options: {
        isValue: true,
        zone: 'child'
      }
    },
    {
      id: 'motion',
      class: 'sensor',
      type: 'test-trigger',
      options: {
        isTrigger: true,
        zone: 'child'
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
      timeout: 0
    },
    {
      id: 'parent',
      name: 'Parent',
      timeout: 0
    },
    {
      id: 'child',
      name: 'Child',
      parent: 'parent',
      timeout: 0
    },
    {
      id: 'simple-timeout',
      name: 'Simple Timeout',
      timeout: 60000
    },
    {
      id: 'parent-timeout',
      name: 'Parent Timeout',
      timeout: 0
    },
    {
      id: 'child-timeout',
      name: 'Child Timeout',
      parent: 'parent-timeout',
      timeout: 60000
    }
  ]
};