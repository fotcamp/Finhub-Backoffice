import { ApiResposne, client } from './client';
import { IAvatar } from '@finhub/types/Avatar';
import { commonAPI } from './common';

const list = async () => {
  const url = '/admin/user-avatar';

  const response: ApiResposne = await client.get(url);

  if (response.status === 'FAIL') {
    return {
      userAvatars: [],
    };
  }

  const dataSource: {
    userAvatars: IAvatar[];
  } = response.data;

  return dataSource;
};

const create = async ({ file }: { file?: any }) => {
  const data: {
    s3ImgUrl?: string;
    errorMsg?: string;
  } = file ? await commonAPI.saveImg(file, 'userAvatar') : {};

  if (file && !data.s3ImgUrl) {
    return { errorMsg: data.errorMsg || '이미지 업로드 실패' };
  }

  const response: ApiResposne = await client.post('/admin/user-avatar', {
    s3ImgUrl: data.s3ImgUrl ?? '',
  });

  if (response.status === 'FAIL') {
    return {
      errorMsg: response.errorMsg,
    };
  }

  const dataSource = response.data;

  return dataSource;
};

const remove = async ({ id }: { id: number }) => {
  const response: ApiResposne = await client.delete('/admin/avatar', {
    id,
  });

  if (response.status === 'FAIL') {
    return {
      errorMsg: response.errorMsg,
    };
  }

  const dataSource = response.data;

  return dataSource;
};

export const avatarAPI = {
  list,
  create,
  remove,
};
