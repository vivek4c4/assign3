(function(){
  angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('menuSearchService',menuSearchService)
.directive('foundItems',FoundItemsDirective)

function FoundItemsDirective() {
  var ddo={
    templateUrl:'items.html',
    scope:{
      items:'=',
      onRemove:'&',
      error:'@'
    },
    controller:NarrowItDownDirectiveController,
    controllerAs:'list',
    bindToController:true
  }

  return ddo
}

function NarrowItDownDirectiveController() {

}

 NarrowItDownController.$inject=['menuSearchService','$timeout']
function NarrowItDownController(menuSearchService,$timeout) {
  var list=this;
  //  var promise=menuSearchService.getMatchedMenuItems();

  list.items=menuSearchService.fetchItems();

    list.NarrowItem=function(){
      list.error="";
      if (list.searchDescription!=null || list.searchDescription!=undefined) {
        menuSearchService.getMatchedMenuItems(list.searchDescription);
        $timeout(function () {
          if (list.items.length==0) {
            list.error="No Menu found for the searched Item.!!";
          }
        }, 1500);
      }
      else {
        list.error="No Search term entered..!"
      }


    // console.log(promise);
      // console.log(menuSearchService.getMatchedMenuItems(list.searchDescription));
// console.log(promise);
      // promise.then(function(response){
      // console.log(response.data);
      //   list.MenuItems=response.data;
      //   // menuSearchService.addItems(list.MenuItems,list.searchDescription);
      //
      //   // console.log(list.MenuItems);
      //   // console.log("pakka mass.!");
      // })
      //  .catch(function(error){
      //    console.log("some error");
      //  });

    }

    list.removeItem=function(index){
      menuSearchService.removeItem(index);
      this.removed="Last item removed" + list.items[index].name;
      
    }

}

menuSearchService.$inject=['$http']
function menuSearchService($http) {
   var service =this;
var found=[];
   service.getMatchedMenuItems=function(searchTerm){
     $http({
       method:"GET",
       url:"https://davids-restaurant.herokuapp.com/menu_items.json"
      // url:"https://davids-restaurant.herokuapp.com/categories.json"
      //  params:{
      //    category:"L"
      //  }
    }).then(function(response){

      angular.forEach(response.data.menu_items,function(value,key){
        if (value.description.indexOf(searchTerm)!==-1) {
          found.push(value);
        }
      } );
      // return foundItems;
      return response.data;
    });
   }

  //  service.addItems=function(allItems,menuDescription){
   //
  //
  //   //  return found;
  //  }

   service.fetchItems=function(){
     return found;
   }
   service.removeItem=function(index){

     found.splice(index,1);
   }

}


})();
