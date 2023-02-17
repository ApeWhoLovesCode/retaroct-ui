import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import glob from 'glob';
import colors from 'colors';
import { XmlData } from './fetchXml';
import { Config } from './getConfig';
import { generateCase } from './utils';
import { getTemplate } from './getTemplate';

export const generateWechatComponent = (data: XmlData, config: Config) => {
  const svgObj: Object = {};
  const names: string[] = [];
  const saveDir = path.resolve(config.save_dir);

  mkdirp.sync(saveDir);
  glob.sync(path.join(saveDir, '*')).forEach((file) => fs.unlinkSync(file));

  data.svg.symbol.forEach((item) => {
    const iconId = item.$.id;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(new RegExp(`^${config.trim_icon_prefix}(.+?)$`), (_, value) =>
          value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'),
        )
      : iconId;

    names.push(iconIdAfterTrim);
    svgObj[iconIdAfterTrim] = generateCase(item);
    console.log(`${colors.green('√')} Generated icon "${colors.yellow(iconId)}"`);
  });

  // 生成svg图标名称的类型
  let iconName: string[] = [],
    iconEnum: string[] = [];
  names.forEach((name) => {
    iconName.push(`"${name}"`);
    iconEnum.push(`"${name}" = "${name}"`);
  }, [] as string[]);
  const iconType = getTemplate('iconType.ts')
    .replace('@iconName', iconName.join(' | '))
    .replace('@iconEnum', iconEnum.join(',\n  '));
  fs.writeFileSync(path.join(saveDir, 'iconType.ts'), iconType);

  // 生成获取svg图标的对象的函数
  let getIconObj = getTemplate('getIconObj.ts').replace('@getIconObj', JSON.stringify(svgObj));
  getIconObj = getIconObj.replace(/"%3Csvg/g, '`%3Csvg').replace(/svg%3E"/g, 'svg%3E`');
  fs.writeFileSync(path.join(saveDir, 'getIconObj.ts'), getIconObj);
  console.log(
    `\n${colors.green('√')} All icons have been putted into dir: ${colors.green(
      config.save_dir,
    )}\n`,
  );

  // 生成demo文件
  // let demoIcon = getTemplate('demoIcon')
  fs.writeFileSync(
    path.join(path.resolve(config.demo_dir), 'index.less'),
    getTemplate('demo.less'),
  );
  let demo = getTemplate('demo.tsx');
  demo = demo.replace('@icon-names', JSON.stringify(names));
  fs.writeFileSync(path.join(path.resolve(config.demo_dir), 'index.tsx'), demo);

  console.log(
    `\n${colors.green('√')} Demo have been putted into dir: ${colors.green(config.demo_dir)}\n`,
  );
};
