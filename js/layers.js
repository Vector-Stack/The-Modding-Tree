addLayer("hrl", {
    name: "hrl", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='hrl.png' style='width:calc(80% - 2px);height:calc(80% - 2px);margin:10%'></img>", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    base:new Decimal(1.01),
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "hrl's", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult=mult.mul(1+player.cyf.points.log(8))
       // console.log(mult)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp=new Decimal(0.7)
        if(hasUpgrade("hrl",21))exp=exp.plus(0.3)
        if(hasUpgrade("hrl",22))exp=exp.plus(0.7)
        return exp//new Decimal(player.hrl.points.log(10))
    },
    
    passiveGeneration(){
		if(hasUpgrade("cyf",11))return 0.01;
		return 0;
	},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for hrl's", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades:{
        rows:2,
        cols:4,
        11:{
            title:"beginning",
            description:"generate 1 xxx per second",
            cost:new Decimal(1),
            unlocked(){return true},
        },
        12:{
            title: "hrl upgrade 12",
            description: "generate xxx by xxx",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("hrl",11)}, // The upgrade is only visible when this is true
            effect(){
                let eff=player.points.pow(0.5).plus(1)
                return eff
            },
            effectDisplay(){
                return "x"+format(this.effect())
            },
        },
        13:{
            title:"hrl upgrade 13",
            description:"generate xxx*4",
            cost:new Decimal(4),
            unlocked(){return hasUpgrade("hrl",12)},
        },
        14:{
            title:"hrl uuupgrade 14",
            description: "lbx's soviet booster generates xxx by hrl",
            cost: new Decimal(10),
            unlocked( ){return hasUpgrade("hrl",13)},
            effect(){
                let eff=player.hrl.points.pow(0.8).plus(1);
                return eff
            },
            effectDisplay(){
                return "×"+format(this.effect())
            },
        },
        21:{
            title: "hrl upgrade 21",
            description: "get more hrl",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("hrl",14)}, // The upgrade is only visible when this is true
        },
        22:{
            title:"hrl upgrade 22",
            description:"hrl is more enormous than before",
            cost:new Decimal(1e7),
            unlocked(){return hasUpgrade("hrl",14)},
            effect(){

            }
        },
        23:{
            title:"hrl upgrade 23",
            description: "cyf get a hrl boost",
            cost: new Decimal(1e15),
            unlocked( ){return hasUpgrade("hrl",21)},
        }
    },
    layerShown(){return true}
})
addLayer("cyf", {
    name: "cyf", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "cyf", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#AABB24",
    branches: ["hrl"],
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "cyf's", // Name of prestige currency
    baseResource: "hrl", // Name of resource prestige is based on
    baseAmount() {return player.hrl.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(2)
    },
    upgrades:{
        rows:1,
        cols:2,
        11:{
            title:"cyf upgrade 11",
            description:"slowly generates hrl",
            cost:new Decimal(10),
            
        },
        12:{
            title:"cyf upgrade 12",
            description:"no hrl upgrade reset",
            cost:new Decimal(100),
            
        },
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for cyf's", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.hrl.points.gte(100)||player.cyf.points.gte(0.001)}
})
