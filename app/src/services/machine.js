export class Machine {
  constructor({ type, addr, description }) {
    this.type = type
    this.addr = addr
    this.description = description
  }
}

export class SlotMachine extends Machine {
  constructor(...args) {
    super(...args)
    let { prices } = args[0]
    this.prices = prices
  }
}

export class SlotMachinePrice {
  constructor({ id, value, prob }) {
    this.id = id
    this.value = value
    this.prob = prob
  }
}

export class Capsule extends Machine {
  constructor(...args) {
    super(...args)
  }
}
