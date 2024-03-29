import styled from '@emotion/styled';
import { CreatePageTemplate } from '../../components/templates/Create';
import { FHFormItem } from '../../components/organisms/FormItem';
import { FHTextInput } from '../../components/atoms/TextInput';
import { FHButton } from '../../components/atoms/Button';
import { useEffect, useState } from 'react';
import { topicAPI } from '../../api/topic';
import { useParams } from 'react-router-dom';
import { FHUploader } from '../../components/atoms/Uploader';
import { FHSelect } from '../../components/atoms/Select';
import { GPTCard } from '../../components/organisms/GPTCard';
import { produce } from 'immer';
import { FHSwitch } from '../../components/atoms/Switch';
import { ICategory } from '../../types/Category';
import { categoryAPI } from '../../api/category';
import { FHTextArea } from '../../components/atoms/TextArea';
import theme from '../../styles/theme';

export const TopicDetailPage = () => {
  const { id } = useParams();
  const topicId = Number(id);
  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');
  const [shortDefinition, setShortDefinition] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [useYN, setUseYN] = useState(false);
  const [gptList, setGptList] = useState<
    {
      gptId: number;
      userTypeId: number;
      usertypeName: string;
      avatarImgPath: string;
      content: string;
      useYN: string;
    }[]
  >([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [gptTemplate, setGptTemplate] = useState(
    '!카테고리!에 관해서 !토픽!에 대해서 !유저타입!에게 알기 쉽게 설명해주고 싶어. 비유를 들어서 !유저타입!이 이해하기 쉽게 설명해줘',
  );
  const [tempGptTemplate, setTempGptTemplate] = useState('');
  const [gptIdx, setGptIdx] = useState(0);

  const handleTextChange =
    (type: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const { value } = e.target;
      if (type === 'title') {
        setTitle(value);
      } else if (type === 'definition') {
        setDefinition(value);
      } else if (type === 'shortDefinition') {
        setShortDefinition(value);
      } else if (type === 'gptTemplate') {
        setGptTemplate(value);
      } else if (type === 'tempGptTemplate') {
        setTempGptTemplate(value);
      }
    };

  const initRequest = async () => {
    const listData = await categoryAPI.list({
      page: 1,
      listSize: 20,
      keyword: '',
      useYN: '전체',
    });
    setCategories(listData.list);

    const data = await topicAPI.show({
      id: topicId,
    });

    if (data) {
      setTitle(data.title ?? '');
      setCategory(data.categoryName ?? 'ETF');
      setDefinition(data.definition ?? '');
      setShortDefinition(data.shortDefinition ?? '');
      setGptList(data.gptList ?? []);
      setUseYN(data.useYN === 'Y');
    }
  };

  const handleSubmit = () => {
    topicAPI.update({
      topicId,
      title,
      definition,
      shortDefinition,
      categoryId: categories.find((ct) => ct.name === category)?.id ?? -1,
      thumbnailImgPath: './logo.svg',
      gptList: gptList.map((gpt) => ({
        gptId: gpt.gptId,
        content: gpt.content,
        useYN: gpt.useYN,
      })),
      useYN,
    });

    alert('반영되었습니다.');
    initRequest();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleClickGPT = (idx: number) => () => {
    setGptIdx(idx);
  };

  const handleGPTCardClick = (idx: number) => () => {
    window.confirm(`${gptList[idx].usertypeName} GPT를 재생성하시겠습니까?`);
  };

  const handleGPTCardChange =
    (idx: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setGptList((prevGptList) => {
        return produce(prevGptList, (draft) => {
          draft[idx].content = e.target.value;
        });
      });
    };

  const handleUseYNChange = (value: boolean) => {
    setUseYN(value);
  };

  const handleClickKeyword = (keyword: string) => () => {
    setTempGptTemplate(tempGptTemplate + keyword);
  };

  const handleSubmitGptTemplate = () => {
    setGptTemplate(tempGptTemplate);
    alert('반영되었습니다.');
  };

  useEffect(() => {
    initRequest();
  }, []);

  const keywords = ['!카테고리!', '!토픽!', '!유저타입!'];

  return (
    <CreatePageTemplate label="주제 수정">
      <S.contentWrapper>
        <S.formWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="썸네일">
              <FHUploader thumbnail={thumbnail} setThumbnail={setThumbnail} />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="카테고리">
              <FHSelect
                value={category}
                onChange={handleCategoryChange}
                items={categories.map((item) => item.name)}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="주제명">
              <FHTextInput
                type="text"
                value={title}
                onChange={handleTextChange('title')}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="요약내용">
              <FHTextArea
                value={definition}
                onChange={handleTextChange('definition')}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="원본내용">
              <FHTextArea
                value={shortDefinition}
                onChange={handleTextChange('shortDefinition')}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="노출여부">
              <FHSwitch value={useYN} onChange={handleUseYNChange} />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="GPT">
              <S.rowWrapper>
                {gptList.map((gpt, index) => (
                  <S.cardWrapper
                    key={gpt.gptId}
                    onClick={handleClickGPT(index)}
                    style={{ opacity: gptIdx !== index ? 0.75 : 1 }}
                  >
                    <S.userTypeWrapper>
                      <S.avatar
                        style={{ backgroundImage: `url(${gpt.avatarImgPath})` }}
                      />
                      <S.name>{gpt.usertypeName}</S.name>
                    </S.userTypeWrapper>
                  </S.cardWrapper>
                ))}
              </S.rowWrapper>
              <GPTCard
                content={gptList[gptIdx] && gptList[gptIdx].content}
                onClick={handleGPTCardClick(gptIdx)}
                onChange={handleGPTCardChange(gptIdx)}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHButton width="100%" onClick={handleSubmit} type="primary">
              주제 수정
            </FHButton>
          </S.formItemWrapper>
        </S.formWrapper>
        <S.logWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="GPT 템플릿">
              <FHTextArea
                readOnly
                value={gptTemplate}
                onChange={handleTextChange('gptTemplate')}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHFormItem direction="vertical" label="">
              <S.rowWrapper>
                {keywords.map((keyword) => (
                  <FHButton
                    key={keyword}
                    onClick={handleClickKeyword(keyword)}
                    type="default"
                  >
                    {keyword}
                  </FHButton>
                ))}
              </S.rowWrapper>
              <FHTextArea
                height={400}
                value={tempGptTemplate}
                onChange={handleTextChange('tempGptTemplate')}
              />
            </FHFormItem>
          </S.formItemWrapper>
          <S.formItemWrapper>
            <FHButton
              width="100%"
              onClick={handleSubmitGptTemplate}
              type="primary"
            >
              GPT 템플릿 수정
            </FHButton>
          </S.formItemWrapper>
        </S.logWrapper>
      </S.contentWrapper>
    </CreatePageTemplate>
  );
};

const S = {
  contentWrapper: styled.div`
    display: flex;
    flex-direction: row;
    max-width: 920px;
    width: 100%;
    padding: 0 16px;
    gap: 16px;
  `,
  formWrapper: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
  `,
  logWrapper: styled.div`
    width: 50%;
    @media only screen and (min-width: 920px) {
      dispaly: none;
    }
  `,
  formItemWrapper: styled.div`
    margin-bottom: 32px;
    width: 100%;
  `,
  cardWrapper: styled.div`
    width: 100%;
    margin-bottom: 32px;
  `,
  rowWrapper: styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    gap: 6px;
  `,
  userTypeWrapper: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  `,
  avatar: styled.div`
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 44px;
    height: 44px;
    margin-right: 8px;
  `,
  name: styled.div`
    font-size: 13px;
    color: ${theme.colors.text[444444]};
  `,
};
