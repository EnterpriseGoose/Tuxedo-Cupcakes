declare global {
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };

  interface Flavor {
    id: string;
    name: string;
    cake: string;
    frosting: string;
    frosting_outline: string;
  }

  interface BoxType {
    quantity: number;
    regular: boolean;
    price: number;
  }

  interface Box {
    type: BoxType;
    cupcakes: Flavor[];
  }

  interface Market {
    week: Date;
    times: string[];
    names: string[];
    flavors: Flavor[];
  }

  interface Order {
    market: Market;
    time: string;
    name: string;
    boxes: Box[];
    info: {
      name: string;
      email: string;
      phone: string;
      extra: string;
      newsletter: boolean;
      save: boolean;
      discount: boolean;
    };
  }
}

export {};