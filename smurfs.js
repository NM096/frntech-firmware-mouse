var Smurfs = {
  devices: {},
}

Smurfs.openDevTools = function () {
  astilectron.sendMessage({"name": "OpenDevTools"})
}

Smurfs.closeDevTools = function () {
  astilectron.sendMessage({"name": "CloseDevTools"})
}

Smurfs.checkDriver = function () {
  astilectron.sendMessage({"name": "CheckDriver"}, function(message) {
    console.log(message.payload)
  })
}

Smurfs.closeApp =  function () {
  astilectron.sendMessage({"name": "CloseApp"})
}

Smurfs.minimizeApp = function () {
  astilectron.sendMessage({"name": "MinimizeApp"})
}

Smurfs.showWindow =  function () {
  astilectron.sendMessage({"name": "ShowWindow"})
}

Smurfs.hideWindow =  function () {
  astilectron.sendMessage({"name": "HideWindow"})
}

Smurfs.on = function (event, func) {
  Smurfs['on' + event] = func;

  if(event === 'DeviceListChanged')
    Smurfs.onDeviceListChanged(Smurfs.devices)
}

Smurfs.listen = function () {
  astilectron.onMessage(function(message) {
    switch (message.name) {
      case "AppReady":
        if (Smurfs.hasOwnProperty('onAppReady'))
          Smurfs.onAppReady(message.payload)
        break
      case "AppConfig":
        if (Smurfs.hasOwnProperty('onAppConfig'))
          Smurfs.onAppConfig(message.payload)
        break
      case "DeviceListChanged":
        var devices = message.payload
        Smurfs.devices = devices
        if (Smurfs.hasOwnProperty('onDeviceListChanged'))
          Smurfs.onDeviceListChanged(devices)
        break
      case "DeviceChanged":
        var data = message.payload
        if (Smurfs.hasOwnProperty('onDeviceChanged'))
            Smurfs.onDeviceChanged(data.Device, data.Info)
        break
      case "UpgradeProgress":
        var data = message.payload
        if (Smurfs.hasOwnProperty('onUpgradeProgress'))
            Smurfs.onUpgradeProgress(data.Device, data.Progress)
        break
        case "MusicLEUpdate":
          var data = message.payload
          if (Smurfs.hasOwnProperty('onMusicLEUpdate'))
              Smurfs.onMusicLEUpdate(data.Device, data.LEData)
          break
      case "DPIWindow":
        if (Smurfs.hasOwnProperty('onDPIWindow'))
          Smurfs.onDPIWindow(message.payload)
        break
    }
  })
}

Smurfs.showOpenDialog = function (filters, callback) {
  dialog.showOpenDialog({
    title: "Open",
    filters: filters,
  }).then(function(result) {
    if (callback && !result.canceled) {
      callback(result.filePaths[0])
    }
  })
}

Smurfs.showSaveDialog = function (filters, callback) {
  dialog.showSaveDialog({
    title: "Save",
    filters: filters,
  }).then(function(result) {
    if (callback && !result.canceled) {
      callback(result.filePath)
    }
  })
}

Smurfs.decToHex = function (num, len) {
  let hex = num.toString(16)
  while (hex.length < len) {
    hex = '0' + hex
  }
  return hex.toUpperCase()
}

Smurfs.getModelList = function (callback) {
  $.getJSON('device/modellist.json', callback);
}

Smurfs.getModelConfig = function (modelID, callback) {
  $.getJSON('device/' + modelID + '/config.json', callback);
}

Smurfs.getModelKeyMap = function (modelID, callback) {
  $.getJSON('device/' + modelID + '/data/keymap.json', callback);
}

Smurfs.getSoftwareVersion = function (callback) {
  if (typeof astilectron === 'undefined') {
    return
  }

  message = {
    "name": "GetSoftwareVersion",
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getDeviceList = function (callback) {
  if (typeof astilectron === 'undefined') {
    return
  }

  message = {
    "name": "GetDeviceList",
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getDefaultProfile = function (modelID, callback) {
  $.getJSON('device/' + modelID + '/data/profile.json', callback);
}

Smurfs.getCurrentProfile = function (modelID, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "GetProfile",
    "payload": {
      "ModelID": modelID,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setCurrentProfile = function (modelID, profile, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetProfile",
    "payload": {
      "ModelID": modelID,
      "Profile": profile,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.importProfile = function (modelID, path, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "ImportProfile",
    "payload": {
      "ModelID": modelID,
      "Path": path,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.exportProfile = function (modelID, profile, path, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "ExportProfile",
    "payload": {
      "ModelID": modelID,
      "Profile": profile,
      "Path": path,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setLE = function (device, le, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetLEDEffect",
    "payload": {
      "Device": device,
      "LEDEffect": le,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getCustomLE = function (device, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "GetCustomLE",
    "payload": {
      "Device": device,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setCustomLE = function (device, cle, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetCustomLE",
    "payload": {
      "Device": device,
      "CustomLE": cle,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setMode = function (device, mode, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "SetMode",
    "payload": {
      "Device": device,
      "Mode": mode,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getDPI = function (device, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "GetDPI",
    "payload": {
      "Device": device,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setDPI = function (device, mode, dpi, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetDPI",
    "payload": {
      "Device": device,
      "Mode": mode,
      "DPI": dpi,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setReportRate = function (device, rr, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetReportRate",
    "payload": {
      "Device": device,
      "ReportRate": rr,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setAdvanceSetting = function (device, advance, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetAdvanceSetting",
    "payload": {
      "Device": device,
      "AdvanceSetting": advance,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getConfigData = function (device, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "GetConfigData",
    "payload": {
      "Device": device,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setConfigData = function (device, config, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetConfigData",
    "payload": {
      "Device": device,
      "Config": config,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.apply = function (device, profile, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetKeyDefine",
    "payload": {
      "Device": device,
      "Profile": profile,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.reset = function (device, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "Reset",
    "payload": {
      "Device": device,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getMacroCategorys = function (callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback([])
    }
    return
  }

  message = {
    "name": "GetMacroCategorys"
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.addMacroCategory = function (category, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "AddMacroCategory",
    "payload": {
      "Category": category,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.delMacroCategory = function (category, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "DelMacroCategory",
    "payload": {
      "Category": category,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getMacros = function (category, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback([])
    }
    return
  }

  message = {
    "name": "GetMacros",
    "payload": {
      "Category": category,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.addMacro = function (category, name, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "AddMacro",
    "payload": {
      "Category": category,
      "Name": name,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.delMacro = function (category, name, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "DelMacro",
    "payload": {
      "Category": category,
      "Name": name,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.readMacro = function (category, name, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "ReadMacro",
    "payload": {
      "Category": category,
      "Name": name,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.saveMacro = function (category, name, macrofile, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "SaveMacro",
    "payload": {
      "Category": category,
      "Name": name,
      "Macrofile": macrofile,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.importMacro = function (path, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "ImportMacro",
    "payload": {
      "Path": path,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.exportMacro = function (name, macrofile, path, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "ExportMacro",
    "payload": {
      "Name": name,
      "Macrofile": macrofile,
      "Path": path,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.upgradeFireware = function (device, modelID, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "UpgradeFireware",
    "payload": {
      "Device": device,
      "ModelID": modelID,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.loadAppConfig = function (callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "LoadAppConfig",
  }
  astilectron.sendMessage(message, function(message) {
    if (callback && message) {
      callback(message.payload)
    }
  })
}

Smurfs.saveAppConfig = function (config, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SaveAppConfig",
    "payload": {
      "Config": config,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.getSystemConfig = function (callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(null)
    }
    return
  }

  message = {
    "name": "GetSystemConfig",
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}

Smurfs.setSystemConfig = function (config, callback) {
  if (typeof astilectron === 'undefined') {
    if (callback) {
      callback(false)
    }
    return
  }

  message = {
    "name": "SetSystemConfig",
    "payload": {
      "Config": config,
    }
  }
  astilectron.sendMessage(message, function(message) {
    if (callback) {
      callback(message.payload)
    }
  })
}
