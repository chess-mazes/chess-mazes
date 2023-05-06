import { preferencesViewModel } from '@/services/preferencesViewModel';
import playlist from '../musicAssets';
import { useEffect, useState } from 'react';

export const BgMusic = ()=> {
    const {soundMode} = preferencesViewModel;
    let {currentSong, audio} = preferencesViewModel
    
    const state = {
        play:true,
        pause:false
    }

    useEffect(()=>{
        if(soundMode){
            console.log(`here1 play=${state.play}`)
            playCurrent()
        }
    },[])

    const playCurrent = ()=>{
        audio = new Audio(playlist[currentSong]);
        audio.addEventListener('ended', () => {
            playNext(playlist.length);
        });
        let playPromise = audio.play();
        console.log(`play ${playlist[currentSong]}`)
        if (playPromise !== undefined) {
            playPromise.then(function () {}).catch(function (error) {
            error = 'the next song is not available'
            console.log(error)
            return
            });
        }
        currentSong += 1;
    };

    const handleClick = ()=>{
        console.log('clicked')
        console.log(audio)
        currentSong = 0;
        if (state.play) {
            if(audio){
                audio.pause(); 
            }
          } 
        else{
           playNext(playlist.length);
        }
        state.play = !state.play
        state.pause = !state.pause
    }
    const playNext = (length: number) => {
        if (currentSong < length) {
          playCurrent()
        } else {
          currentSong = 0;
          playNext(length);
        }
      };
    return (
    <div>
      <button onClick={handleClick}>play music</button>
    </div>
  )
}


