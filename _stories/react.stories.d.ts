import * as React from 'react';
export declare function State<S extends object>(props: {
    value: S;
    children: (state: S, setState: (state: S) => void) => React.ReactElement;
}): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
