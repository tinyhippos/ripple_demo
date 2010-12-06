require 'rubygems'
require 'sinatra'

get '/' do
	redirect '/wac/index.html'
end

get '/wac' do
	redirect '/wac/index.html'
end

get '/phonegap' do
	redirect '/phonegap/index.html'
end
