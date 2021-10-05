import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { BiseNetV2 } from 'bisenetv2-js'

export const rainbow = [
    [110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167],
    [238, 67, 149], [255, 78, 125], [255, 94, 99],  [255, 115, 75],
    [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64],
    [175, 240, 91], [135, 245, 87], [96, 247, 96],  [64, 243, 115],
    [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213],
    [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195]
];

function App() {
    const [ maskEnable, setMaskEnable ] = useState(false)
    const [ model, setModel ] = useState<BiseNetV2|null>(null)

    const img = useMemo(()=>{
        return document.createElement("img")
    },[])

    useEffect(()=>{
        img.onload = () =>{
            const canvas = document.getElementById("face") as HTMLCanvasElement
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        img.src = "./yuka_kawamura.jpg"
        return
    },[]) // eslint-disable-line

    const handleLoadModel = async() =>{
        if(!model){
            const mod = await import('bisenetv2-js')
            const lib = new mod.BiseNetV2()
            await lib.init()
            setModel(lib)
        }
    }

    const handleClick = async () => {
        if(!maskEnable){
            setMaskEnable(true)
            const canvas = document.getElementById("face") as HTMLCanvasElement

            const prediction = await model!.predict(canvas, 256, 256)

            if(prediction){
                const tmp = document.createElement("canvas")
                tmp.width = prediction[0].length
                tmp.height = prediction.length
                const data = new ImageData(tmp.width, tmp.height)
                for (let rowIndex = 0; rowIndex < tmp.height; rowIndex++) {
                  for (let colIndex = 0; colIndex < tmp.width; colIndex++) {
                    const pix_offset = ((rowIndex * tmp.width) + colIndex) * 4
                    data.data[pix_offset + 0] = 128
                    data.data[pix_offset + 1] = rainbow[prediction[rowIndex][colIndex]][0]
                    data.data[pix_offset + 2] = rainbow[prediction[rowIndex][colIndex]][1]
                    data.data[pix_offset + 3] = rainbow[prediction[rowIndex][colIndex]][2]
                  }
                }
                tmp.getContext("2d")!.putImageData(data, 0, 0)
            
                const ctx = canvas.getContext("2d")!
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                ctx.drawImage(tmp, 0, 0, canvas.width, canvas.height)
            }

        }else{
            setMaskEnable(false)
            const canvas = document.getElementById("face") as HTMLCanvasElement
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)            
        }
    }

    return (
        <div className="App">
            <div>
                <canvas id="face"/>
            </div>
            <div>
                {
                    model?
                        <button onClick={handleClick}> Mask! </button>
                        :
                        <button onClick={handleLoadModel}> Load Model </button>
                }
            </div>
        </div>
    );
}

export default App;
