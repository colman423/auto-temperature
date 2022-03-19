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

const CLIENT_ID = '874134398713-9lotcehg8rm0d68ht0m2brdagp4gjgo9.apps.googleusercontent.com';

function App() {
  const [isLogin, setLogin] = useState(false);
  const [user, setUser] = useState({});
  const [enableWeekday, setWeekday] = useState(false);
  const [enableHoliday, setHoliday] = useState(false);

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

  const onChangeWeekday = () => {

  };

  const onChangeHoliday = () => {

  };

  return (
    <Container>
      <Block>
        <Title>1. 請把你ㄉgmail帳號傳給10號，等權限加好之後再進行下一步</Title>
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
            <p>成功進行到這裏的話，代表在營期間都會自動登記體溫了！(如果程式沒有壞掉的話)</p>
            <p>登記時間為06:00以及18:00，體溫為35.5~37度隨機挑選</p>
            <p>登記顏色都是在家的綠色，跟你的頭頂一樣</p>
            <p>如果想取消功能，或是連假日都想自動登記體溫的話，請看下一步</p>
          </Block>
          <Block>
            <Title>4. 點選下面的開關可以設定是否自動登記體溫</Title>
            <p>但是我還沒做完，所以這個功能還沒辦法用</p>
            <Label>
              <span>在營自動登記體溫</span>
              <Switch onChange={onChangeWeekday} checked={enableWeekday} disabled/>
            </Label>
            <br />
            <Label>
              <span>假日自動登記體溫</span>
              <Switch onChange={onChangeHoliday} checked={enableHoliday} disabled/>
            </Label>
          </Block>
        </>
      }
    </Container>
  );
}

export default App;
