export function usePermission(routeName: string) {
  const isShowBtnPermission = (code: string) => {
    return {
      name: routeName,
      code
    };
  };

  return {
    isShowBtnPermission
  };
}
