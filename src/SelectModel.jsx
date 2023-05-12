export default function SelectModel({ currentModel, changeModel }){
    return (
        <div className="selection__container">
        <button 
          onClick={() => changeModel('murakami')}
          style={{outline: currentModel === 'murakami' ? '1px solid white': null}} 
        >  
          🌸
        </button>

        <button 
          onClick={() => changeModel('neon_sign')}
          style={{outline: currentModel === 'neon_sign' ? '1px solid white': null}} 
        >  
          😺
        </button>

        <button 
          onClick={() => changeModel('dragon')}
          style={{outline: currentModel === 'dragon' ? '1px solid white': null}} 
        >  
          🐉
        </button>
      </div>
    )
}