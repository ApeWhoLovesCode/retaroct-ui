// 该脚本用来全量迁移对应的Taro组件到taro-device中
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const rootPath = path.resolve(__dirname, '..');
const files = glob.sync(`${rootPath}/src/*`);
const h5PagesList = [];

function copyComponent() {
  files.forEach((fileItem) => {
    const strList = fileItem.split('/');
    const componentName = strList[strList.length - 1];
    if (componentName !== 'index.ts' && componentName !== 'utils') {
      try {
        fs.ensureDirSync(`${rootPath}/taro-device/src`);
        /** 组件目录移动 */
        const componentTargerDir = `${rootPath}/taro-device/src/pages/${componentName}`;
        fs.ensureDirSync(componentTargerDir);
        fs.copySync(fileItem, componentTargerDir);
        fs.ensureFileSync(`${componentTargerDir}/demo/index.config.ts`);
        h5PagesList.push(`pages/${componentName}/demo/index`);
      } catch (err) {
        console.error(err);
      }
    } else if (componentName === 'utils') {
      try {
        fs.ensureDirSync(`${rootPath}/taro-device/src`);
        /** 组件目录移动 */
        const componentTargerDir = `${rootPath}/taro-device/src/pages/${componentName}`;
        fs.ensureDirSync(componentTargerDir);
        fs.copySync(fileItem, componentTargerDir);
      } catch (err) {
        console.error(err);
      }
    }
  });

  /** app.config.ts文件修改 */
  fs.ensureFileSync(`${rootPath}/taro-device/src/app.config.ts`);
  const targetStr = `export default {pages: [${h5PagesList.map((item) => `'${item}'`)}]}`;
  fs.outputFile(`${rootPath}/taro-device/src/app.config.ts`, targetStr);
}

copyComponent();
