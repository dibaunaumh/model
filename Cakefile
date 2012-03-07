fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'


build = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'static/js', 'model_app']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    process.stdout.write data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0


task 'build', 'Build model_app', ->
  build()


watch = (callback) ->
  coffee = spawn 'coffee', ['-w', '-c', '-o', 'static/js', 'model_app']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    process.stdout.write data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0


task 'watch', 'Watch model_app and compile when it changes', ->
  watch()
