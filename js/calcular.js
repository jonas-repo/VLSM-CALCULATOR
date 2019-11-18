
    document.getElementById("calculate").addEventListener("click",creaCajas,false)
    document.getElementById("calc").addEventListener("click",calcula,false)
	function calcula()
	{ 
     $("#addTable2").empty();
     var orderedDevices = getSizes();
     var devices = orderedDevices.length;
     var subsM = [];
     for(var i=0; i < devices ; i++)
         {
           subsM[i] = hostCant(orderedDevices[i]); 
           subsM[i] = 256 - subsM[i];
         }
        fillboxes(orderedDevices,subsM);

	}
    
    function getSizes()
    { 
        var numCajas = $("#redes").val();
        var cantidades=[];
        var aux=0;
        var sum=0;
        for(var i=0; i < numCajas; i++)
            { 
                cantidades[i] = parseInt($("#cantidad"+i+"").val());
                sum = cantidades[i] + aux;
                aux = sum;                    
            }
        if(sum > hostAvailables())
            {
              alert("La cantidad de dispositivos es mayor a la cantidad de host disponibles"); 
            }
        cantidades.sort(ordenacion);
        return cantidades; 
    }
    
    function hostCant(orderedDevice)
    {
       var subnet;
        for(var i=0; i < 8; i++)
           {
             if(orderedDevice <= (Math.pow(2,i)-2))
                 {
                   subnet =  Math.pow(2,i); 
                   i=8;
                 }
           }
       return subnet;
        
    }
    
    function fillboxes(cantidades,subMask)
    {
       var numCajas = $("#redes").val();
       var ip = $("#ipAdress").val()
       ip = ip.split(".");
       var subnet = getSubnet();
       var ipEnd=0;
       var ipAux=[];
       var ipRed=0;
       var control = 0;
       for(var i=0; i < numCajas; i++)
            {
               var TR = document.createElement("tr");
               var TD1 = document.createElement("td");
               var TD2 = document.createElement("td");
               var TD3 = document.createElement("td"); 
               var TD4 = document.createElement("td");
               var TD5 = document.createElement("td");  
               var TD6 = document.createElement("td");    
               TD1.innerHTML="<label>"+cantidades[i]+"</label>" 
               TD2.innerHTML="<label>"+getSubnet(subMask[i])+"</label>"
               if(i==0)
                   {
                     TD3.innerHTML="<label>"+ini(ip,0)+"</label>"
                     TD4.innerHTML="<label>"+ini(ip,1)+"</label>"
                     TD5.innerHTML="<label>"+ipfinal(ip,subMask[i])+"</label>"
                     TD6.innerHTML="<label>"+broadcast(ip,subMask[i])+"</label>"
                     ipAux = broadcast2(ip,subMask[i],ipEnd);
                     ipAux = ipAux.split(".");
                     ipEnd = parseInt(ipAux[3])+1;                     
                   }
                else
                  {
                    
                     TD3.innerHTML="<label>"+ini(ip,ipEnd)+"</label>"
                     TD4.innerHTML="<label>"+ini(ip,ipEnd+1)+"</label>"
                     TD5.innerHTML="<label>"+ipfinal2(ip,ipEnd,subMask[i])+"</label>"
                     TD6.innerHTML="<label>"+broadcast2(ip,subMask[i],ipEnd)+"</label>"
                     ipAux = broadcast2(ip,subMask[i],ipEnd);
                     ipAux = ipAux.split(".");
                     ipEnd = parseInt(ipAux[3])+1;
                     
                  }
               TR.appendChild(TD1);
               TR.appendChild(TD2);
               TR.appendChild(TD3); 
               TR.appendChild(TD4);   
               TR.appendChild(TD5); 
               TR.appendChild(TD6); 
               $("#addTable2").append(TR);
             }
                 
    }
    
    function ini(ip,ip1)
    {
      ip[3] = ip1;
      ip = ip[0].concat("."+ip[1]+"."+ip[2]+"."+ip[3]);
      return ip;
    }
    
    function ipfinal(ip,ip1)
    {
      ip[3] = 256 - ip1 - 2;
      ip = ip[0].concat("."+ip[1]+"."+ip[2]+"."+ip[3]);
      return ip;
    }
    
    function ipfinal2(ip,ip1,sub)
    {
      ip[3] = 256 - sub + ip1 -2;
      ip = ip[0].concat("."+ip[1]+"."+ip[2]+"."+ip[3]);
      return ip;
    }
    
     function broadcast(ip,ip1)
    {
      ip[3] = 256 - ip1 - 1;
      ip = ip[0].concat("."+ip[1]+"."+ip[2]+"."+ip[3]);
      return ip;
    }
    
    function broadcast2(ip,ip1,sub)
    {
      ip[3] = 256 - ip1 - 1 + sub;
      ip = ip[0].concat("."+ip[1]+"."+ip[2]+"."+ip[3]);
      return ip;
    }
    
   
    
    function getSubnet(submask)
    {
        var array = $("#netMask").val();
        array = array.split(".");
        array = array[0].concat("."+array[1]+"."+array[2]+"."+submask);
        return array;
    }
        
    function ordenacion(a,b)
    {
      return b -a; // si el primero es mayor que el segundo retorna un positivo
      //y alreves retorna -1 esto para arreglar en orden de menor a mayor
    }
    
    
    function creaCajas()
    {
      var numCajas = $("#redes").val();
      var red=1;
      $("#addTable").empty();
      $("#addTable2").empty();
       for(var j=0; j< numCajas;j++)
       {
         var TR = document.createElement("tr");
         var TD2 = document.createElement("td");
         TD2.innerHTML="<input type='number' id='cantidad"+j+"' class='form-control' placeholder='Dispositivos' />";        
        TR.appendChild(TD2);
        $("#addTable").append(TR);
       }
        $("#calc").prop("disabled",false);
      }
      
    
    
    function hostAvailables()
    {
      $("#avHost").empty();
      var array = $("#netMask").val();
      array = array.split(".");
      var aux = 0;
      var sum = 0;
      var part1 = convertirBinario(array[3]);
      var comp = [128,64,32,16,8,4,2,1];    
      for(var i = 0 ; i < 8 ; i++)
          {
            if(part1[i]==0)
            {
              sum = comp[i] + aux;
              aux = sum;
            }
          }
          var hosts  =  sum - 1;
          var label = document.createElement("label");
          label.innerHTML = "<label>Host disponibles = "+hosts+"</label>";
          $("#avHost").append(label);
          return hosts;
    }
    
    
    

	function convertirBinario(arre) //pasar numero a binario 
	{
      red1 = arre;
      var binari= [];
      var bits = 128;
      for(var i= 0 ; i < 8 ;i++)
      {
       if((red1 == bits)||(red1 > bits) )
        {
          binari[i] = 1;
          red1 = red1 - bits;
        }
       else
        {
      	  binari[i] = 0;
        }
        bits = bits / 2;
      }
      return binari;
    }

	function convertirDecimal(binari) //convertir de binario a decimal
	{
      var binari1 = binari;

      var bits = 128;
      for(var i= 0 ; i < 8 ;i++)
      {
       if(binari1[i] == 1 )
        {
          binari1[i] = bits;
        }
        bits = bits / 2;
      }
      var aux=0;
      var bin;
      for(var i = 0 ; i < 8 ; i++)
      {
       bin = binari1[i] + aux;
       aux = bin; 
      }
      return bin;
    }

   function controltag(e) {          //funcion para evitar insertar letras
        tecla = (document.all) ? e.keyCode : e.which; 
        if (tecla==8) return true; // para la tecla de retroseso
        else if (tecla==0||tecla==9)  return true; //<-- PARA EL TABULADOR-> su keyCode es 9 pero en tecla se esta transformando a 0 asi que porsiacaso los dos
        patron =/[0-9.\s]/;// -> solo letras y  .
       // patron =/[0-9\s]/;// -> solo numeros
        te = String.fromCharCode(tecla);
        return patron.test(te); 
    }




