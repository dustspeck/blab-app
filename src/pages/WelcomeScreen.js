import React, {useState} from 'react';
import {View} from 'react-native';
import Step1Page from '../components/Welcome/Step1Page';
import Step2Page from '../components/Welcome/Step2Page';
import BrandingPage from '../components/Welcome/BrandingPage';

const WelcomeScreen = ({navigation}) => {
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    setStage(stage + 1);
  };

  switch (stage) {
    case 0:
      return <BrandingPage nextStage={nextStage} />;
      break;
    case 1:
      return <Step1Page nextStage={nextStage} />;
      break;
    case 2:
      // return <Step1Page nextStage={nextStage} />;
      return <Step2Page navigation={navigation} />;
      break;
    default:
      break;
  }
};

export default WelcomeScreen;
