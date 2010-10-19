require 'rubygems'
require 'sinatra'

get '/' do
	redirect '/jil/index.html'
end

get '/jil' do
	redirect '/jil/index.html'
end

get '/phonegap' do
	redirect '/phonegap/index.html'
end