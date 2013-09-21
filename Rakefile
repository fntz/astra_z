require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'yaml'

Bundler.require

logger = Logger.new(STDOUT)
logger.formatter = Proc.new do  |severity, time, progname, msg|
  "\e[32m#{msg}\e[0m\n"
end


ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = logger
BUNDLES     = ["astra_z.js"]
BUILD_DIR   = ROOT.join(".")
SOURCE_DIR  = ROOT.join("src")
SOURCE_FILE = "astra_z.js"
OUTPUT       = BUILD_DIR.join(SOURCE_FILE)
VERSION_FILE = "version.yaml"
VERSION = YAML.load_file("#{SOURCE_DIR}/#{VERSION_FILE}")['VERSION'] 

task :compile do
  FileUtils.rm OUTPUT if File.exist?(OUTPUT)

  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(SOURCE_DIR.join('javascript').to_s)
  
  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)
    assets.write_to(OUTPUT)
  end
end
