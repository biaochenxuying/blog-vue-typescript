// 声明全局的 window ，不然使用 window.XX 时会报错
declare var window: Window;
declare var document: Document;
declare var THREE: any;

// interface THREE extends Window {}

declare module "element-ui/lib/transitions/collapse-transition";
declare module "element-ui";
