declare type PickDeclarationWithReturnType<T, ReturnType> = T extends (...args: any) => ReturnType
    ? (...args: any) => ReturnType
    : T;
