import { XmlData } from './fetchXml';

const ATTRIBUTE_FILL_MAP = ['path'];

export const generateCase = (data: XmlData['svg']['symbol'][number]) => {
  let template =
    `<svg viewBox='${data.$.viewBox}' ` +
    "xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>";

  for (const domName of Object.keys(data)) {
    if (domName === '$') {
      continue;
    }

    const counter = {
      colorIndex: 0,
    };

    if (data[domName].$) {
      template += `<${domName}${addAttribute(domName, data[domName], counter)} />`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `<${domName}${addAttribute(domName, sub, counter)} />`;
      });
    }
  }

  template += `</svg>`;

  return template.replace(/<|>/g, (matched) => encodeURIComponent(matched));
};

const addAttribute = (
  domName: string,
  sub: XmlData['svg']['symbol'][number]['path'][number],
  counter: { colorIndex: number },
) => {
  let template = '';

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      sub.$.fill = sub.$.fill || '#333333';
    }

    for (const attributeName of Object.keys(sub.$)) {
      if (attributeName === 'fill') {
        template += ` ${attributeName}` + "='${color}'";
        counter.colorIndex += 1;
      } else {
        template += ` ${attributeName}='${sub.$[attributeName]}'`;
      }
    }
  }

  return template;
};
