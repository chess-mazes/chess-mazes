import { preferencesViewModel } from '@/services/preferencesViewModel';
import playlist from '../musicAssets';
import { FC, useEffect } from 'react';
import { observer } from 'mobx-react';

export let audio: HTMLAudioElement | undefined

export const BgMusic: FC = observer(({})=>{
    const {soundMode} = preferencesViewModel;
    let {isPlay} = preferencesViewModel
    let currentSong = 0
    
    //TODO: when soundmode change -> change the volume to 100/0 but the song continue
    // useEffect(()=>{
    //     console.log(`soundMode change to ${soundMode}`)
    //     if(soundMode){
    //         handleClick()
    //     }
    // },[soundMode])

    //TODO: music play only when the soundmode in true
    //TODO: CSS to the button
    //TODO: next button

    console.log('render')
    useEffect(()=>{
        console.log(`only when render the page`)
        if(soundMode){
            handleClick()
        }
    },[])

    const handleClick = ()=>{
        currentSong = 0;
        if (isPlay && audio) {
            audio.pause(); 
          } 
        else{
           playcurrent();
        }
        isPlay = !isPlay
    }

    const getCurr = ()=>{
        if (currentSong < length) {
            currentSong+=1
            return currentSong-1
        }else{
            currentSong=0
            return currentSong
        }
    }
    const playcurrent = ()=>{
        console.log('here')
        audio = new Audio(playlist[getCurr()]);
        audio.addEventListener("ended", () => {
            playcurrent
        });
        let playPromise = audio.play();
        console.log('play')
        if (playPromise !== undefined) {
            playPromise.catch(function (error:Error) {
            'the next song is not available'
            console.log('the next song is not available', error)
            });
        } 
    }
    
    return (
    <div>
        <button onClick={handleClick}>play music</button>
    </div>
  )
});

