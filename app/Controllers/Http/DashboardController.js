'use strict'

const Fuzzy = use('App/Fuzzy/FuzzyLogic')

class DashboardController {

    constructor () {
        this.fuzzy = new Fuzzy
    }

    table({request, response, view}){
        const data = this.fuzzy.getOriginalData() 
        this.index() 
        const prediction = this.fuzzy.getPrediction()
         console.log("prediksi: ", prediction)  
        return view.render('dashboard.index',{
            data, prediction
        })
    }

    index () {
        console.log("Jalan")
        let iterasi = 0
        let i = 10
        this.fuzzy.createMatrixU()
        for (let index = 0; index < i; index++) {
            
            this.fuzzy.multiplyMatrix()
            this.fuzzy.createMembership()
            
            if( this.fuzzy.calculateObjektif()){
                break    
            }else{
                this.fuzzy.updateMiu()
            }      
        }
        this.fuzzy.calculateMean()
        this.fuzzy.calculateDeviasi() 
        
        this.fuzzy.firstLayer()
        this.fuzzy.secondLayer() 
        this.fuzzy.thirdLayer()
        this.fuzzy.fourthLayer()
        this.fuzzy.fifthLayer()    
    }
}

module.exports = DashboardController
