import { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { FHButton } from '@finhub/components/atoms/Button';
import { FHDivider } from '@finhub/components/atoms/Divider';
import { LayoutTemplate } from '@finhub/components/templates/Layout';
import { avatarAPI } from '@finhub/api/avatar';
import { IAvatar } from '@finhub/types/Avatar';
import { FHUploader } from '@finhub/components/atoms/Uploader';
import * as S from './List.style';

const AvatarThumbnail = ({
  src,
  onDelete,
}: {
  src: string;
  onDelete: () => void;
}) => {
  return (
    <S.thumnbnailWrapper data-testid="avatar" onClick={onDelete}>
      <img width={124} height={124} alt="avatar" src={src} />
      <div>
        <S.CloseIcon />
      </div>
    </S.thumnbnailWrapper>
  );
};

export const AvatarListPage = () => {
  const [list, setList] = useState<IAvatar[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!thumbnail) {
      return message.warning('이미지를 업로드 해주세요.');
    }

    await avatarAPI.create({ file: thumbnail });
    message.info('반영되었습니다');
    initRequest();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('아바타를 삭제하시겠습니까?')) {
      try {
        await avatarAPI.remove({ id });
        initRequest();
        message.success('반영되었습니다.');
      } catch {
        message.error('오류 확인부탁드립니다.');
      }
    }
  };

  const initRequest = async () => {
    const { userAvatars } = await avatarAPI.list();
    setList(userAvatars);
  };

  useEffect(() => {
    initRequest();
  }, []);

  return (
    <>
      <LayoutTemplate>
        <S.pageHeaderWrapper>
          <div>아바타 목록</div>
          <FHButton
            onClick={showModal}
            type="primary"
          >{`아바타 추가`}</FHButton>
        </S.pageHeaderWrapper>
        <S.contentWrapper>
          <FHDivider />
          <S.listWrapper>
            {list.map((avatar) => (
              <AvatarThumbnail
                key={avatar.id}
                src={avatar.s3ImgUrl}
                onDelete={() => handleDelete(avatar.id)}
              />
            ))}
          </S.listWrapper>
        </S.contentWrapper>
      </LayoutTemplate>
      <Modal
        data-testid="avatar-uploader-modal"
        title="아바타추가"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <FHUploader thumbnail={thumbnail} setThumbnail={setThumbnail} />
      </Modal>
    </>
  );
};
