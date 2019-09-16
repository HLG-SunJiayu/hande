const JD_PREFIX_IMG_URL = 'http://img13.360buyimg.com';

export function jdConvertImg(path, level = 0) {
  return `${JD_PREFIX_IMG_URL}/n${level}/${path}`;
}
