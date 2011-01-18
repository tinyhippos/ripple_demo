require 'rubygems'
require 'sinatra'

get '/' do
	redirect '/wac/index.html'
end

get '/wac/' do
	redirect '/wac/index.html'
end

get '/phonegap/' do
	redirect '/phonegap/geo/index.html'
end

get '/phonegap/accel/' do
	redirect '/phonegap/accel/index.html'
end

get '/phonegap/geo/' do
	redirect '/phonegap/geo/index.html'
end
