import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

import * as Constants from '../../constants/misc';
import {startupCounter, hasRated} from '../../sharedMethods/DBManager';

import RatingModal from './RatingModal';

const ShowRatingModal = () => {
  const [showMenu, setShowMenu] = useState(false);

  const shouldShowRatingModal = async () => {
    let has_rated = await hasRated();
    if (!has_rated) {
      let startup_count = await startupCounter();
      if (
        startup_count >= Constants.SHOW_RATING_AFTER_INITIAL_COUNT &&
        startup_count % Constants.SHOW_RATING_AFTER_EACH_COUNT === 0
      )
        setShowMenu(true);
    }
  };

  useEffect(() => {
    shouldShowRatingModal();
  }, []);
  return (
    <>
      {showMenu && (
        <RatingModal showMenu={showMenu} setShowMenu={setShowMenu} />
      )}
    </>
  );
};

export default ShowRatingModal;
