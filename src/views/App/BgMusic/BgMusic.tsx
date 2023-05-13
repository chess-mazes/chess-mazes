import { preferencesViewModel } from '@/services/preferencesViewModel';
import playlist from '../musicAssets';
import { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

export let audio: HTMLAudioElement | undefined
export let firstAudio: HTMLAudioElement | undefined

export const BgMusic: FC = observer(({})=>{
    const {soundMode} = preferencesViewModel;
    let {isPlay} = preferencesViewModel
    let currentSong = -1
    const effectRun = useRef(true)

    useEffect(()=>{
        if(effectRun.current === true){
            if(soundMode){
                firstAudio = new Audio(playlist[getCurr()]);
                firstAudio.addEventListener("ended", () => {
                    playcurrent
                });
                let playPromise = firstAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function (error:Error) {
                    'the next song is not available'
                    console.log('the next song is not available', error)
                    });
                } 
            }
        }
        return ()=>{
            effectRun.current = false
        }
    },[])

    const playPauseClick = ()=>{
        currentSong = -1;
        if(firstAudio){
            firstAudio.pause();
            firstAudio = undefined
        }
        else{
            if (isPlay && audio) {
                audio.pause();
                isPlay = !isPlay 
            } 
            else if(soundMode){
                playcurrent();
                isPlay = !isPlay
            }
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
            firstAudio?.pause()
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

