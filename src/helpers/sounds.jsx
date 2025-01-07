import alertSound from '../assets/sounds/alert.mp3';

export const playAlertSound = () => {
    const audio = new Audio(alertSound);
    audio.play();
}