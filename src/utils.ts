export function hasOwnProperty<X extends any, Y extends PropertyKey>(
  obj: X,
  prop: Y,
): obj is X & Record<Y, any> {
  return obj.hasOwnProperty(prop);
}
