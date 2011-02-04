require 'rubygems'
require 'sinatra'
require 'erb'

params = "?enableripple=true"

get '/wac*' do
	redirect '/wac/index.html' + params
end

get '/phonegap/contacts*' do
	redirect '/phonegap/contacts/index.html' + params
end

get '/phonegap/compass*' do
	redirect '/phonegap/compass/index.html' + params
end

get '/phonegap/accel*' do
	redirect '/phonegap/accel/index.html' + params
end

get '/phonegap/geo*' do
	redirect '/phonegap/geo/index.html' + params
end

get '/phonegap*' do
	redirect '/phonegap/geo/index.html' + params
end

get '/' do
  erb :directory
end
