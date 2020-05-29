class NewRelic {
    public c = 'Y';
    constructor(nr: number, test: Test) {
        console.log('POK');
    }
}

class NewRelic2 {
    constructor(newRelicKey: boolean) {}
}

class Test {
    public x = 'OK';
    constructor(nr: number) {}
}

type Class = new (...args: any) => any;

type Config<T> = T extends {
    class: new (...args: infer R) => any;
    arguments: any;
}
    ? {
          class: any;
          arguments: R;
      }
    : never;

const config = {
    class: NewRelic,
    arguments: [123, '123']
};

checkConfig({
    serviceName1: {
        class: Test,
        arguments: [123]
    },

    serviceName2: {
        class: NewRelic,
        arguments: ['asd', '@serviceName1']
    }
});

type ReplaceType<A, RT, RTN> = {
    [T in keyof A]: A[T] extends RT ? RTN | A[T] : A[T];
};

type ConfigType<T> = T extends {
    class: new (...args: infer CP) => any;
}
    ? {
          class: new (...args: CP) => any;
          arguments: CP;
      }
    : { bla: 'OK ' };

function checkConfig<
    T extends {
        serviceName1: {
            class: new (args: ConfigType<CP1>) => any;
        };
        serviceName2: {
            class: new (args: CP2) => any;
        };
    },
    CP1 extends ['string'],
    CP2 extends ['string']
>(config: { serviceName1: ConfigType<T['serviceName1']>; serviceName2: ConfigType<T['serviceName2']> }) {}
