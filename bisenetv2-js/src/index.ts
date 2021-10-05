import * as tf from '@tensorflow/tfjs';


// @ts-ignore
import modelJson from "../resources/bisenetv2-celebamask/model.json"
// @ts-ignore
import modelWeight1 from "../resources/bisenetv2-celebamask/group1-shard1of3.bin"
// @ts-ignore
import modelWeight2 from "../resources/bisenetv2-celebamask/group1-shard2of3.bin"
// @ts-ignore
import modelWeight3 from "../resources/bisenetv2-celebamask/group1-shard3of3.bin"

export class BiseNetV2{
    model: tf.GraphModel | null = null
    canvas = document.createElement("canvas")


    init = async () => {
        const modelJson2 = new File([modelJson], "model.json", {type: "application/json"})
        const b1 = Buffer.from(modelWeight1.split(',')[1], 'base64')
        const modelWeights1 = new File([b1], "group1-shard1of3.bin")
        const b2 = Buffer.from(modelWeight2.split(',')[1], 'base64')
        const modelWeights2 = new File([b2], "group1-shard2of3.bin")
        const b3 = Buffer.from(modelWeight3.split(',')[1], 'base64')
        const modelWeights3 = new File([b3], "group1-shard3of3.bin")
        this.model = await tf.loadGraphModel(tf.io.browserFiles([modelJson2, modelWeights1, modelWeights2, modelWeights3]))
    }
    predict = async (targetCanvas: HTMLCanvasElement, processWidth: number, processHeight: number): Promise<number[][]> => {
        this.canvas.width = processWidth
        this.canvas.height = processHeight
        const ctx = this.canvas.getContext("2d")!
        ctx.drawImage(targetCanvas, 0, 0, this.canvas.width, this.canvas.height)
        let bm: number[][]
        tf.tidy(() => {
            let tensor = tf.browser.fromPixels(this.canvas)
            tensor = tf.sub(tensor.expandDims(0).div(127.5), 1)
            let prediction = this.model!.predict(tensor) as tf.Tensor
            // console.log(prediction)
            bm = prediction.arraySync() as number[][]
        })
        return bm!
    }

}