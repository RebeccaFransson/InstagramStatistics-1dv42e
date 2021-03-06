"use strict";
/*
Kollar efter olika funktioner
Tar gamla staten, kopierar den och ändrar på kopian
*/
export default function reducer(currState, action){
  switch (action.type) {
    case 'SET_ERROR':
      return Object.assign({}, currState, {
        error: action.error
      });
    case 'SAVE_TOKEN':
      return Object.assign({}, currState, {
        user: {
          token: action.token
        }
      });
    case 'SAVE_PROFILE':
      return Object.assign({}, currState, {
        user: {
          token: action.token,
          profile: action.profile
        }
      });
    case 'SAVE_STATISTICS':
      return Object.assign({}, currState, {
        statistics: {
          mediaOverTime: action.counts.mediaOverTime,
          followed_byOverTime: action.counts.followed_byOverTime,
          followsOverTime: action.counts.followsOverTime,
          topThree: action.topThree
        }
      });
    case 'LOGOUT':
      return Object.assign({}, currState, {
        user: {
          profile: null,
          token: null
        }
      });
    case 'TOGGLE_NEXT':
      if(action.slides.constructor == Array){
        var next = action.slides.indexOf(currState.currentSlide) + 1;
        if(next >= action.slides.length){
          next = 0;
        }//Sätter den uträknade sliden
        return Object.assign({}, currState, {
          currentSlide: action.slides[next]
        });
      }else{//Sätter den inskickade sliden
        return Object.assign({}, currState, {
          currentSlide: action.slides
        });
      }
    default:
      return currState;
  }
}
