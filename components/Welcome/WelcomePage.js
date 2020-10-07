import React, {useState} from 'react';
import {View} from 'react-native';
import IntroPage from './IntroPage';
import StepsPage from './StepsPage';

const WelcomePage = ({navigation, isFirstRun, setIsFirstRun}) => {
  const [display, setDisplay] = useState(isFirstRun);
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    console.log('qwe');
    setStage(stage + 1);
  };

  if (stage == 0) {
    return <IntroPage nextStage={nextStage} />;
  } else {
    return <StepsPage setIsFirstRun={setIsFirstRun} />;
  }
};

export default WelcomePage;
