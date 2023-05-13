import { preferencesViewModel } from '@/services/preferencesViewModel';
import playlist from '../musicAssets';
import { FC, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

export let audio: HTMLAudioElement | undefined
export let firstAudio: HTMLAudioElement | undefined

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
        currentSong = 0;
        console.log(`isPlay=${isPlay} audio=${audio}`)
        if(firstAudio){
            firstAudio.pause();
            firstAudio = undefined
        }
        else{
            if (isPlay && audio) {
                console.log('press pause')
                audio.pause(); 
            } 
            else{
            playcurrent();
            }
            isPlay = !isPlay
            console.log(`isPlay=${isPlay}`)  
        }
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
        console.log('playcurrent')
        console.log(`isPlay=${isPlay}`)
        audio = new Audio(playlist[getCurr()]);
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
    
    //TODO 
    const NextClick = ()=>{

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

