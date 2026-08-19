// Dispatcher mekanik game: pilih komponen sesuai flavor.type level
import SwipeGame from './game/SwipeGame'
import Tap2Game from './game/Tap2Game'
import QuickTapGame from './game/QuickTapGame'
import DragDropGame from './game/DragDropGame'
import StoryGame from './game/StoryGame'
import LikertSlider from './game/LikertSlider'
import LikertEmoji from './game/LikertEmoji'
import LikertDial from './game/LikertDial'
import PourLoveGame from './game/PourLoveGame'

export default function GameEngine({ level, flavor, initialAnswers = {}, onComplete }) {
  const total = level.items.length
  const props = { level, flavor, total, onFinal: onComplete, initialAnswers }

  switch (flavor?.type) {
    case 'pour-love': return <PourLoveGame {...props} />
    case 'swipe': return <SwipeGame {...props} />
    case 'tap2': return <Tap2Game {...props} />
    case 'quicktap': return <QuickTapGame {...props} />
    case 'dragdrop': return <DragDropGame {...props} />
    case 'story': return <StoryGame {...props} />
    case 'likert-slider': return <LikertSlider {...props} />
    case 'likert-emoji': return <LikertEmoji {...props} />
    case 'likert-dial': return <LikertDial {...props} />
    default: return <LikertSlider {...props} />
  }
}
