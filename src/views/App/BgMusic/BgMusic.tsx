import { preferencesViewModel } from '@/services/preferencesViewModel';
import playlist from '../musicAssets';
import { FC } from 'react';
import { observer } from 'mobx-react';

export let audio: HTMLAudioElement | undefined

export const BgMusic: FC = observer(({})=>{
    const {soundMode} = preferencesViewModel;
    let {isPlay} = preferencesViewModel
    let currentSong = -1

    const playPauseClick = ()=>{
        currentSong = -1;
        if (isPlay && audio) {
            audio.pause();
            isPlay = !isPlay 
        } 
        else if(soundMode){
            playcurrent();
            isPlay = !isPlay
        }
    }

    const getCurr = ()=>{
        if (currentSong < playlist.length-1) {
            currentSong+=1
        }else{
            currentSong=0
        }
        return currentSong
    }
    const playcurrent = (_currentSong = getCurr())=>{
        audio = new Audio(playlist[_currentSong]);
        audio.addEventListener("ended", () => {
            playcurrent
        });
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error:Error) {
            'the next song is not available'
            console.log('the next song is not available', error)
            });
        } 
    }
    
    const NextClick = ()=>{
        if(isPlay){
            audio?.pause()
            playcurrent()
        }
    }

    return (
    <div className={`flex flex-row justify-center flex-wrap my-3`}>
        <button className="button" id="btPlayMusic" onClick={playPauseClick} title="Play">
        Play/Pause
        </button>
        <button className="button" id="btnNextMusic" onClick={NextClick} title="Next">
        Next
        </button>
    </div>
  )
});

