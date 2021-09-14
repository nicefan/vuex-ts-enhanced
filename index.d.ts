import { Store, StoreOptions, CommitOptions } from 'vuex'

type Obj<T = any> = Record<string, T>

type AddPrefix<Keys, Prefix = ''> = `${Prefix & string}${Prefix extends '' ? '' : '/'}${Keys & string}`
type AddNs<K, P, N> = N extends { namespaced: boolean } ? (N['namespaced'] extends true ? AddPrefix<K, P> : P) : P
type GetActionParam<F> = F extends (context: any, ...params: infer P) => infer R ? [P, R] : never
// type UniKeys<X> = X extends Obj ? keyof X : never
// type GetValue<X, Key extends string> = X extends Obj ? (X[Key] extends Array<any> ? X[Key] : never) : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I extends Obj
    ? I
    : never
  : never

// best
type AllState<Opt> = (Opt extends { state: infer S } ? Readonly<S extends () => infer P ? P : S> : undefined) &
  (Opt extends { modules: infer SubM }
    ? Readonly<
        {
          [K in keyof SubM]: AllState<SubM[K]>
        }
      >
    : unknown)

type GetMap<Opt, Target extends string, Pre = ''> = UnionToIntersection<
  | (Opt extends { [_ in Target]: infer MM }
      ? {
          [K in keyof MM as AddPrefix<K, Pre>]: GetActionParam<MM[K]>
        }
      : never)
  | GetModulesMap<Opt, Target, Pre>
>

type GetModulesMap<Opt, Target extends string, Pre = ''> = Opt extends { modules: infer SubM }
  ? {
      [K in keyof SubM]: GetMap<SubM[K], Target, AddNs<K, Pre, SubM[K]>>
    }[keyof SubM]
  : never

type AllGetter<Opt, G extends Obj = GetMap<Opt, 'getters'>> = {
  readonly [K in keyof G]: G[K][1]
}
type AllCommit<Opt, G extends Obj = GetMap<Opt, 'mutations'>> = {
  <K extends keyof G>(
    type: K,
    ...payload: [...a: G[K][0] extends [] ? [payload?: null] : G[K][0], options?: CommitOptions]
  ): void
  // <S extends { type: keyof G }>(payloadWithType: S, options?: CommitOptions): void
}
type AllDispatch<Opt, G extends Obj = GetMap<Opt, 'actions'>> = {
  <S extends keyof G>(type: S, ...payload: G[S][0]): Promise<G[S][1]>
}

interface ExStore<Opt extends StoreOptions<any>> extends Store<Opt['state']> {
  readonly getters: AllGetter<Opt>
  readonly state: AllState<Opt>
  dispatch: AllDispatch<Opt>
  commit: AllCommit<Opt>
}

type ExStoreOptions<Opt extends StoreOptions<any>, S> = StoreOptions<S> & Opt

export function createStore<S, Opt>(options: ExStoreOptions<Opt, S>): ExStore<Opt>

// export function createStore<O extends StoreOptions<any>>(options: O): ExStore<O>
// export type ExCreateStore<S> = <Opt extends StoreOptions<S>>(options: Opt) => ExStore<Opt>
// export function baseUseStore<S = any>(injectKey?: InjectionKey<S> | string): S;
