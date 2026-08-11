/* FluxoHub Analytics 360°
   Compatibility shim.
   The dashboard engine lives in index.html so there is only ONE state/render loop.
   This file intentionally does not bind navigation, filters, data loading or imports.
   Keeping this file prevents old cached deployments from failing when referenced. */
(()=>{
  'use strict';
  window.FluxoHubEngine = window.FluxoHubEngine || { version: '6.0-stable' };
})();
