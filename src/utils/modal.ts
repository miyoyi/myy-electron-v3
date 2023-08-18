import { Modal } from "@arco-design/web-vue";

export default (option: any, type = "confirm") => {
  return new Promise((resolve, reject) => {
    Modal[type]({
      ...option,
      onOk(res: any) {
        resolve(res);
      },
      onCancel() {
        reject();
      }
    });
  });
};
