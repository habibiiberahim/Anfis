'use strict'

const DataTraining = use('App/data')
const math = require('mathjs')

class FuzzyLogic {

    constructor () {
        this.p0 = 0 
        this.layer4 = []
        this.layer5 = []  
        this.data = DataTraining.data
        this.resultsX = []
        this.miuData = []
        this.newData = []
        this.DataL = [] 
        this.DataLH = []
        this.member=[]
        this.weight = []
        this.weightNew = []
        this.mean = []
        this.parameter= []
        this.deviasi=[]
        this.centerData = []
        this.cluster = 2
        this.resultA = 0
        this.resultB = 0
        this.result_a = 0
        this.result_b = 0
        this.result_c = 0
        this.result_d = 0
        this.err = 0.001
        this.p = 0
        this.prediction = 0
    }

    getOriginalData() {
        return DataTraining.data
    }

    createMatrixU(){    
        this.data.forEach(item => {
            let miu =Math.random() * Math.floor(1)
            let a=Math.pow(miu,2)
            let b=Math.pow(1 -miu,2)
            this.miuData.push({
                id: item.id,
                x1: a,
                x2: b
            })
        })
        this.calculateSum()
    }

    calculateSum(){
        this.miuData.forEach(item => {    
            this.resultA += item.x1
            this.resultB += item.x2
        })   
    }

    multiplyMatrix(){  
        this.newData = []
        this.centerData = []
        this.data.forEach(item=>{
            let a = item.x1 *  this.miuData[item.id-1].x1
            let b = item.x2 *  this.miuData[item.id-1].x1
            let c = item.x1 *  this.miuData[item.id-1].x2
            let d = item.x2 *  this.miuData[item.id-1].x2
        
            this.result_a += a
            this.result_b += b
            this.result_c += c
            this.result_d += d   
            
            this.newData.push({
                id: item.id,
                x1m1: a,
                x1m2: b,
                x2m1: c,
                x2m2: d    
            })  
        })
        this.centerData.push({
            x11: this.result_a/this.resultA,
            x12: this.result_b/this.resultA,
            x21: this.result_c/this.resultB,
            x22: this.result_d/this.resultB 
        })
        console.log("Data center: \n",this.centerData)
        
    }

    createMembership(){
        this.DataL = [] 
        this.data.forEach(item => {
           let x = Math.sqrt(Math.abs((item.x1-this.centerData[0].x11)+(item.x2-this.centerData[0].x12)))
           let y = Math.sqrt(Math.abs((item.x1-this.centerData[0].x21)+(item.x2-this.centerData[0].x22))) 
           let z = (x+y)

           this.DataL.push({
            id: item.id,
            L1: x,
            L2: y,
            LT: z,
            L1LT: x/z,
            L2LT: y/z
            })
        })
    }

    updateMiu(){
        this.miuData = []
        this.data.forEach(item => {
            this.miuData.push({
                id: item.id,
                x1: Math.pow(this.DataL[item.id-1].L1LT,2),
                x2: Math.pow(this.DataL[item.id-1].L2LT,2)
            })  
        })
        this.calculateSum()
    }

    calculateObjektif(){
        this.DataLH = []
        this.DataL.forEach(item => {     
            let x = item.L1 *  this.miuData[item.id-1].x1
            let y = item.L2 *  this.miuData[item.id-1].x2
            let z = (x + y)
         
            this.p+=z 

            this.DataLH.push({
            id: item.id, 
            L3: x,
            L4: y,
            Lresult: z
             
            })
        })
        let temp = Math.abs(this.p-this.p0)
        
        if(Math.abs(temp) < this.err){
            return true
        }else{
            this.p0 = temp
            this.p = 0
            return false
        }
        
    }

    checkCount(count, value){
        if(count === 0){
            return value=0
        }else{
           return value/count     
        }
    }
  

    calculateMean(){
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        let countC1 = 0
        let countC2 = 0 
        
        console.log('DataL: ', this.DataL)
        this.DataL.forEach(item => {
            if(item.L2LT < item.L1LT){
                countC1++
                a += this.data[item.id-1].x1 
                c += this.data[item.id-1].x2
            }else{
                countC2++
                b += this.data[item.id-1].x1 
                d += this.data[item.id-1].x2
                
            }       
        })
         a = this.checkCount(countC1, a)
         b = this.checkCount(countC2, b)
         c = this.checkCount(countC1, c)
         d = this.checkCount(countC2, d)
       
            this.mean.push({
                c11: a,
                c12: b,
                c21: c,
                c22: d
            })
            
        console.log("Data mean: \n",this.mean)
    }

    calculateDeviasi(){
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        let countC1 = 0
        let countC2 = 0 

        this.DataL.forEach(item => { 
            if(item.L2LT < item.L1LT){
                countC1++
                //A = 
                a += this.data[item.id-1].x1 - this.mean[0].c12 
                //B = 
                b += this.data[item.id-1].x2 - this.mean[0].c22  
            }else{
                countC2++
                //C = 
                c += this.data[item.id-1].x1 - this.mean[0].c11 

                //D = 
                d += this.data[item.id-1].x2 - this.mean[0].c21 
                
            }       
            
        })

        let a12 = Math.sqrt((Math.pow(a,2)/countC1))
        let a22 = Math.sqrt((Math.pow(b,2)/countC1))
        let a11 = Math.sqrt((Math.pow(c,2)/countC2))
        let a21 = Math.sqrt((Math.pow(d,2)/countC2))
       
        this.deviasi.push({
            a11: a11,
            a12: a12,
            a21: a21, 
            a22: a22
        })  
        // console.log("Nilai Deviasi: \n",this.deviasi)
        // console.log("Total Cluster 1: ",countC1)
        // console.log("Total Cluster 2: ",countC2)
    }

    firstLayer(){
        this.data.forEach(item => {
            
            let a1 = 1/(1+Math.abs(Math.pow((item.x1-this.mean[0].c11)/this.deviasi[0].a11,2)))
            let b1 = 1/(1+Math.abs(Math.pow((item.x2-this.mean[0].c12)/this.deviasi[0].a12,2)))
            let a2 = 1/(1+Math.abs(Math.pow((item.x1-this.mean[0].c21)/this.deviasi[0].a21,2)))
            let b2 = 1/(1+Math.abs(Math.pow((item.x2-this.mean[0].c22)/this.deviasi[0].a22,2)))
          
            this.member.push({
                A1: a1,
                A2: a2,
                B1: b1,
                B2: b2
            })   
            
        })  
        // console.log(this.member)  

    }

    secondLayer(){
        this.member.forEach(item => {
            let w1 = item.A1 * item.B1
            let w2 = item.A2 * item.B2
            this.weight.push({
                weight1: w1,
                weight2: w2,
                
            })   
        })   
        // console.log("Lapisan kedua",this.weight)  
    }

    thirdLayer(){
        this.weight.forEach(item => {
            let x = item.weight1/ (item.weight1+item.weight2)
            let y = item.weight2/ (item.weight1+item.weight2) 
            this.weightNew.push({
                w1: x,
                w2: y
                
            })   
        })   
        // console.log("Lapisan Ketiga",this.weightNew)  
    }

    fourthLayer(){
        let allTarget = []
        this.data.forEach(item => {
            let a = this.weightNew[item.id-1].w1 * item.x1
            let b = this.weightNew[item.id-1].w1 * item.x2
            let c = this.weightNew[item.id-1].w1 
            let d = this.weightNew[item.id-1].w2 * item.x1
            let e = this.weightNew[item.id-1].w2 * item.x2
            let f = this.weightNew[item.id-1].w2 
          

            this.parameter.push({
                p1: a,
                q1: b,
                r1: c,
                p2: d,
                q2: e,
                r2: f
            })
            // console.log("Parameter Koeifesin",this.parameter)
            allTarget.push(item.target)
        })
        
        let praMatriks = []
        this.parameter.forEach(item => {
            praMatriks.push([
                item.p1, item.q1, item.r1, item.p2, item.q2, item.r2
            ])
        })

        const matriks = math.matrix(praMatriks)
        const matriksInverse = math.inv(matriks._data)
        
        matriksInverse.forEach((item, index) => {
            let temp = 0

            item.forEach((col, index) => {
                temp += col * allTarget[index]
               
            })
            
            this.resultsX.push(temp)
        })
        // console.log("Matix",this.resultsX)
      

        this.data.forEach(item =>{
            let w1y1 = this.weightNew[0].w1 * ((this.resultsX[0]*item.x1)+(this.resultsX[1]*item.x2)+(this.resultsX[2]))
            let w2y2 = this.weightNew[0].w2 * ((this.resultsX[3]*item.x1)+(this.resultsX[4]*item.x2)+(this.resultsX[5]))
    
      
            this.layer4.push({
                W1Y1: w1y1,
                W2Y2: w2y2
            })
        }) 
        //  console.log("Layer 4",this.layer4)
        
    }

    fifthLayer(){
        this.layer4.forEach(item=>{
            let sum = item.W1Y1 + item.W2Y2
            this.layer5.push(sum)    
        })

        const arrSum = arr => arr.reduce((a,b) => a + b, 0)/this.layer4.length
        return this.prediction = arrSum(this.layer5)
        
    }
    getPrediction(){
        return this.prediction 
    }

    checkError(){

    }
    
    
}

module.exports = FuzzyLogic
