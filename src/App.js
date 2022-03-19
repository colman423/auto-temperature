import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import styled from 'styled-components';
import Switch from "react-switch";

const Container = styled.div`
  padding: 40px;
`;

const Block = styled.div`
  margin-bottom: 50px;
`;
const Title = styled.div`
  font-weight: 500;
  font-size: 1.2rem;
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
`;

const Button = styled.button`

`;

const CLIENT_ID = '874134398713-9lotcehg8rm0d68ht0m2brdagp4gjgo9.apps.googleusercontent.com';

function App() {
  const [isLogin, setLogin] = useState(false);
  const [user, setUser] = useState({});
  const [enableWeekday, setWeekday] = useState(0);
  const [enableHoliday, setHoliday] = useState(0);

  const onSuccess = async ({ code }) => {
    console.log('onSuccess', code);
    const { data } = await axios.post('https://create-tokens-apis-gateway-b5kl1urd.an.gateway.dev/create-tokens', { code });
    console.log('data', data);
    if (data.success) {
      setLogin(true);
      setUser({ email: data.data.email, name: data.data.name });
      setWeekday(data.data.enable_weekday);
      setHoliday(data.data.enable_holiday);
    }
  };

  const onFailure = (err) => {
    console.log('onFailure', err);
  };

  const updateConfigs = async (config) => {
    const { data } = await axios.post('https://update-configs-apis-gateway-b5kl1urd.an.gateway.dev/update-configs', {
      email: user.email,
      enable_weekday: enableWeekday,
      enable_holiday: enableHoliday,
      ...config
    });
    console.log('data', data);
    setWeekday(data.enable_weekday);
    setHoliday(data.enable_holiday);
  }

  const onChangeWeekday = (checked) => {
    updateConfigs({ enable_weekday: checked ? 1 : 0 });
  };

  const onChangeHoliday = (checked) => {
    updateConfigs({ enable_holiday: checked ? 1 : 0 });
  };

  return (
    <Container>
      <Block>
        <Title>1. 請把你ㄉgmail信箱傳給10號，等權限加好之後再進行下一步</Title>
      </Block>
      <Block>
        <Title>2. 點底下的按鈕登入，選好信箱之後按「繼續」，然後把日曆那邊的框框勾起來，然後按確定</Title>
        {!isLogin && <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="點我登入"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy='single_host_origin'
          responseType='code'
          accessType='offline'
          scope='openid email profile https://www.googleapis.com/auth/calendar'
        />}
      </Block>
      {!isLogin ?
        <Block>
          <Title>3. 先登入才有下一步歐</Title>
        </Block>
        :
        <>
          <Block>
            <Title>3. 你好{user.name} {user.email}</Title>
            <p>🤙成功進行到這裏的話，代表在營期間都會自動登記體溫了！(如果程式沒有壞掉的話)</p>
            <p>🤙登記時間為06:00以及18:00，體溫為35.5~37度隨機挑選</p>
            <p>🤙登記顏色都是在家的綠色，跟你的頭頂一樣</p>
            <p>🤙如果想取消功能，或是連假日都想自動登記體溫的話，請點選下面開關</p>
            <Label>
              <span>在營自動登記體溫</span>
              <Switch onChange={onChangeWeekday} checked={enableWeekday} />
            </Label>
            <br />
            <Label>
              <span>假日自動登記體溫</span>
              <Switch onChange={onChangeHoliday} checked={enableHoliday} />
            </Label>
          </Block>
          <Block>
            <Title>4. 點選以下按鈕測試，但我還沒做</Title>
            <Button>測試</Button>
            {/* <p>🤙點選後應該會在日曆馬上新增一筆體溫</p>
            <p>🤙如果過了3分鐘都沒有出現的話，可能代表程式壞掉ㄌQQ</p>
            <p>🤙平常不用點這個按鈕，這個按鈕只是測試用ㄉ！</p> */}
          </Block>
        </>
      }
    </Container>
  );
}

export default App;
