'use strict'

const Fuzzy = use('App/Fuzzy/FuzzyLogic')

class DashboardController {

    constructor () {
        this.fuzzy = new Fuzzy
    }

    async index () {
        let iterasi = 0
        let i = 100
        this.fuzzy.createMatrixU()
        for (let index = 0; index < i; index++) {
            iterasi++
            this.fuzzy.multiplyMatrix()
            this.fuzzy.createMembership()
            if( this.fuzzy.getObjektif()){
                break    
            }else{
                this.fuzzy.updateMiu()
            }
            
        }
        console.log("Total iterasi: "+iterasi)

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
