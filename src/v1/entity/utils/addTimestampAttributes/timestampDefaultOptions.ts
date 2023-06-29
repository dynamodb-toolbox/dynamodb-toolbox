export type TimestampsDefaultOptions = {
  created: {
    name: 'created'
    savedAs: '_ct'
    hidden: false
  }
  modified: {
    name: 'modified'
    savedAs: '_md'
    hidden: false
  }
}

export const TIMESTAMPS_DEFAULTS_OPTIONS: TimestampsDefaultOptions = {
  created: { name: 'created', savedAs: '_ct', hidden: false },
  modified: { name: 'modified', savedAs: '_md', hidden: false }
}
