import styled from '@emotion/styled';
import { CloseOutlined } from '@ant-design/icons';
import theme from '@finhub/styles/theme';

export const pageHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  div {
    font-size: 16px;
    font-weight: 600;
  }
`;

export const contentWrapper = styled.div`
  width: 100%;
`;

export const listWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const thumnbnailWrapper = styled.div`
  position: relative;
  width: 124px;
  height: 124px;
  cursor: pointer;

  img {
    object-fit: cover;
    border-radius: 50%;
  }

  div {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    color: ${theme.colors.white};
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    border-radius: 50%;
  }

  &:hover {
    div {
      opacity: 1;
    }
  }
`;

export const CloseIcon = styled(CloseOutlined)`
  font-size: 24px;
`;
